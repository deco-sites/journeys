export interface Props {
    text: string;
    linkBar: string;
    linkText: string;
    linkUrl: string;
}

const TextBar = ({ linkBar, linkText, linkUrl, text }: Props) => (
    <div class="flex flex-col justify-center p-2 bg-green-100 text-center text-black text-sm font-medium font-primary md:flex-row">
        <a href={linkBar}>
            <span>
                {text}
            </span>
        </a>
        <a class="mx-4 underline" href={linkUrl}>
            {linkText}	
        </a>
    </div>
);

export default TextBar;