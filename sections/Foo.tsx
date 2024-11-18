interface Props {
  longTitle: string;
}

export default function Foo({ longTitle }: Props) {
  return (
    <div class="text-zinc-200 text-2xl">
      <style
        dangerouslySetInnerHTML={{
          __html: `
                body {
                    background-color: #242424;
                    height: 100vh;
                    padding: 16px;
                }
            `,
        }}
      />
      <p>{longTitle}</p>
    </div>
  );
}
