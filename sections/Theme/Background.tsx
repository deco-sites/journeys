export interface Props {
  /**
   * @description Background color
   * @format color
   */
  color: string;
}

export default function Background({ color }: Props) {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
      body {
        background-color: ${color};
      }
      `,
      }}
    />
  );
}
