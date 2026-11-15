// Copyright 2024. The Tari Project
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
// following disclaimer in the documentation and/or other materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote
// products derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
// USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

use crate::{
    LOG_TARGET_APP_LOGIC,
    tapplets::error::{
        Error::{self, TappletServerError},
        TappletServerError::*,
    },
};

use axum::{
    Router,
    extract::State,
    http::{Request, StatusCode, header},
    response::IntoResponse,
    routing::get,
};
use log::{error, info};
use std::{collections::HashMap, net::SocketAddr, path::PathBuf, sync::LazyLock};
use tokio::{select, sync::Mutex};
use tokio_util::sync::CancellationToken;

static ACTIVE_TAPPLET_SERVERS: LazyLock<Mutex<HashMap<PathBuf, CancellationToken>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));

/// TU Lite shows the built-in bridge in a phone-sized window. The tapplet is laid out for the
/// desktop app and paints an 11 MB artwork background, so the host replaces that background with a
/// plain surface and lets the fixed-width content column shrink to the window. This only styles the
/// page we serve; the file on disk stays untouched and is still verified against its pinned hash.
const TU_LITE_TAPPET_STYLE: &str = r#"<style id="tu-lite-tapplet-style">
    html, body {
        background-color: #f4f1ec !important;
        background-image: linear-gradient(180deg, #f7f4ef 0%, #eae4d9 100%) !important;
        overflow-x: hidden !important;
    }
    body { width: 100% !important; min-width: 0 !important; }
    main[class*="pl-(--tu-padding-left)"] { padding-left: 16px !important; padding-right: 16px !important; }
    [class*="w-[clamp(480px"] { width: 100% !important; max-width: 100% !important; }
    [class*="text-5xl"] { font-size: 34px !important; line-height: 1.05 !important; }
    [class*="text-[20px]"] { font-size: 15px !important; line-height: 1.35 !important; }
    main > header[class*="absolute top-8 right-8"] { top: 16px !important; right: 16px !important; }
    main > div[class*="absolute bottom-2"] { padding-left: 16px !important; padding-right: 16px !important; }
    [class*="relative flex gap-[2px]"] { flex-direction: column !important; gap: 8px !important; }
    [class*="relative flex gap-[2px]"] > * { width: 100% !important; min-width: 0 !important; }
    [class*="relative flex flex-[2] gap-[2px]"] { flex-direction: column !important; gap: 8px !important; }
    [class*="relative flex flex-[2] gap-[2px]"] > *:not([class*="absolute"]) { width: 100% !important; min-width: 0 !important; }
    [class*="w-full flex flex-col p-1"] > div > [class*="flex items-center justify-center"] {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 8px !important;
    }
    [class*="w-full flex flex-col p-1"] > div > [class*="flex items-center justify-center"] > div { width: 100% !important; }
    [class*="w-full flex flex-col p-1"] [class*="MuiButtonBase-root"] { width: 100% !important; max-width: 100% !important; }
    @media (max-width: 1000px) {
        .this-hide { display: flex !important; justify-content: center !important; }
        .this-hide svg { display: none !important; }
        .this-hide > div::before {
            content: "";
            display: block;
            width: 18px;
            height: 18px;
            background: #171717;
            -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 21V3M4 7l4-4 4 4M16 3v18M12 17l4 4 4-4'/%3E%3C/svg%3E") center / contain no-repeat;
            mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 21V3M4 7l4-4 4 4M16 3v18M12 17l4 4 4-4'/%3E%3C/svg%3E") center / contain no-repeat;
        }
    }
</style>"#;

fn inject_tu_lite_style(relative: &str, bytes: Vec<u8>) -> Vec<u8> {
    if !relative.ends_with(".html") {
        return bytes;
    }
    const HEAD_END: &[u8] = b"</head>";
    let Some(index) = bytes
        .windows(HEAD_END.len())
        .position(|window| window == HEAD_END)
    else {
        return bytes;
    };
    let mut injected = Vec::with_capacity(bytes.len() + TU_LITE_TAPPET_STYLE.len());
    injected.extend_from_slice(&bytes[..index]);
    injected.extend_from_slice(TU_LITE_TAPPET_STYLE.as_bytes());
    injected.extend_from_slice(&bytes[index..]);
    injected
}

pub async fn start_tapplet(tapplet_path: PathBuf) -> Result<(String, CancellationToken), Error> {
    info!(target: LOG_TARGET_APP_LOGIC, "Start tapplet path {:?}", &tapplet_path);
    crate::executable_integrity::verify_bridge_directory(&tapplet_path)
        .map_err(Error::IntegrityError)?;
    start_serving(tapplet_path.clone(), verified_routes(tapplet_path)).await
}

async fn start_serving(
    tapplet_path: PathBuf,
    routes: Router,
) -> Result<(String, CancellationToken), Error> {
    let key = tapplet_path
        .canonicalize()
        .unwrap_or_else(|_| tapplet_path.clone());
    // Starts are serialized across tapplets; use per-path locks if the number grows.
    let mut active_servers = ACTIVE_TAPPLET_SERVERS.lock().await;
    active_servers.retain(|_, token| !token.is_cancelled());
    if let Some(prev_token) = active_servers.remove(&key) {
        prev_token.cancel();
    }
    let (address, cancel_token) = serve(routes, 0).await?;
    active_servers.insert(key, cancel_token.clone());
    Ok((address, cancel_token))
}

fn verified_routes(tapplet_path: PathBuf) -> Router {
    Router::new()
        .fallback(get(serve_verified_file))
        .with_state(tapplet_path)
}

async fn serve_verified_file(
    State(root): State<PathBuf>,
    request: Request<axum::body::Body>,
) -> axum::response::Response {
    let decoded = match urlencoding::decode(request.uri().path()) {
        Ok(path) => path.into_owned(),
        Err(_) => return StatusCode::BAD_REQUEST.into_response(),
    };
    let relative = decoded.trim_start_matches('/');
    let relative = if relative.is_empty() || relative.ends_with('/') {
        format!("{relative}index.html")
    } else {
        relative.to_owned()
    };
    match crate::executable_integrity::load_bridge_content(&root, &relative) {
        Ok(bytes) => {
            // The bytes on disk are hash-verified on every request; TU Lite then adds its own
            // stylesheet to HTML so the desktop-sized bridge fits the phone window.
            let bytes = if crate::variant::TU_LITE {
                inject_tu_lite_style(&relative, bytes)
            } else {
                bytes
            };
            let content_type = mime_guess::from_path(&relative)
                .first_or_octet_stream()
                .to_string();
            (
                [
                    (header::CONTENT_TYPE, content_type),
                    (header::X_CONTENT_TYPE_OPTIONS, "nosniff".to_string()),
                ],
                bytes,
            )
                .into_response()
        }
        Err(error) => {
            error!(target: LOG_TARGET_APP_LOGIC, "Bridge content verification failed: {error}");
            StatusCode::FORBIDDEN.into_response()
        }
    }
}

pub async fn serve(app: Router, port: u16) -> Result<(String, CancellationToken), Error> {
    info!(target: LOG_TARGET_APP_LOGIC, "Launch tapplet on port {:?}", &port);
    let cancel_token = CancellationToken::new();
    let cancel_token_clone = cancel_token.clone();

    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .inspect_err(
            |e| error!(target: LOG_TARGET_APP_LOGIC, "Failed to bind port server error: {e:?}"),
        )
        .map_err(|_| {
            TappletServerError(BindPortError {
                port: addr.to_string(),
            })
        })?;
    let address = listener
        .local_addr()
        .inspect_err(
            |e| error!(target: LOG_TARGET_APP_LOGIC, "Failed to obtain local address error: {e:?}"),
        )
        .map_err(|_| TappletServerError(FailedToObtainLocalAddress))?
        .to_string();

    tauri::async_runtime::spawn(async move {
        axum::serve(listener, app)
            .with_graceful_shutdown(shutdown_signal(cancel_token_clone))
            .await
            .inspect_err(
                |e| error!(target: LOG_TARGET_APP_LOGIC, "Failed to start server error: {e:?}"),
            )
            .map_err(|_| TappletServerError(FailedToStart))
    });
    info!(target: LOG_TARGET_APP_LOGIC, "🚀 The tapplet was launched at the address: {:?}", &address);

    Ok((address, cancel_token))
}

async fn shutdown_signal(cancel_token: CancellationToken) {
    select! {
        _ = cancel_token.cancelled() => {}
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn injects_lite_style_before_head_end() {
        let html = b"<html><head><title>Bridge</title></head><body></body></html>".to_vec();
        let injected = String::from_utf8(inject_tu_lite_style("index.html", html)).unwrap();
        let style = injected.find("tu-lite-tapplet-style").expect("style is injected");
        let head_end = injected.find("</head>").expect("head end stays");
        assert!(style < head_end);
    }

    #[test]
    fn leaves_non_html_content_untouched() {
        let script = b"console.log('</head>')".to_vec();
        assert_eq!(inject_tu_lite_style("app.js", script.clone()), script);
    }

    #[test]
    fn leaves_html_without_head_untouched() {
        let fragment = b"<div>fragment</div>".to_vec();
        assert_eq!(inject_tu_lite_style("fragment.html", fragment.clone()), fragment);
    }

    #[tokio::test]
    async fn concurrent_starts_leave_only_one_server_active_for_a_path() {
        let directory = tempfile::tempdir().expect("temporary tapplet directory");
        let path = directory.path().to_path_buf();
        let (first, second) = tokio::join!(
            start_serving(path.clone(), Router::new()),
            start_serving(path.clone(), Router::new())
        );
        let (_, first_token) = first.expect("first server starts");
        let (_, second_token) = second.expect("second server starts");

        assert!(first_token.is_cancelled() ^ second_token.is_cancelled());
        first_token.cancel();
        second_token.cancel();
        ACTIVE_TAPPLET_SERVERS.lock().await.remove(&path);
    }
}
