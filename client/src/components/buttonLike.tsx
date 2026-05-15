import {Link} from "react-router-dom";

interface ButtonLikeProps {
    text: string;
    to: string;
    className?: string;
    subText?: string;
};

function ButtonLike({text, to, className = "", subText}:ButtonLikeProps) {
    return (
        <>
            {subText && (
                <p className="subText">
                    {subText}
                </p>
            )}

            <Link className={`button-like ${className}`}
                  to={to}>
                {text}
            </Link>
        </>
    )
}

export default ButtonLike;