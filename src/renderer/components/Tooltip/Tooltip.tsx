interface TooltipProps {
    text: string,
}

export default function Tooltip({text}: TooltipProps) {
    return (
        <div className={"tooltip"} aria-hidden={true}>
            {text}
        </div>
    );
}