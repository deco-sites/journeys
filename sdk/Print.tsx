import { useScript } from "@deco/deco/hooks";

export default function Print({ data }: { data: unknown }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: useScript((a) => console.log(a), data),
      }}
    />
  );
}
