import { cn } from "@/lib/utils";

type PhotoDownloaderProps = {
  className?: string;
  width?: number;
  height?: number;
};

export function DownloadIcon({
  className,
  width = 24,
  height = 24,
}: PhotoDownloaderProps) {
  return (
    <svg
      className={cn("fill-primary-content", className)}
      width={width}
      height={height}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h4.992l-2.496-4h-2.496q-0.832 0-1.44-0.576t-0.576-1.408v-14.016h24v14.016q0 0.832-0.576 1.408t-1.408 0.576h-2.528l-2.496 4h5.024q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256 1.76t-1.76 4.256v20zM4 10.016v-4q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0 1.408 0.608t0.576 1.408v4h-24zM6.016 8h1.984v-1.984h-1.984v1.984zM10.016 24l5.984 8 6.016-8h-4v-8h-4v8h-4zM10.016 8h1.984v-1.984h-1.984v1.984zM14.016 8h12v-1.984h-12v1.984z"></path>
    </svg>
  );
}
