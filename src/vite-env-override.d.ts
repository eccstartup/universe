declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>;
    export default content;
}

interface ImportMetaEnv {
    readonly VITE_TU_LITE?: string;
}
