import React from "react";
import styles from "./Button.module.css";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  pending?: boolean;
};

export default function Button({ children, pending, ...props }: ButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [progressTime, setProgressTime] = React.useState<number>(0);

  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (pending) {
      timer = setInterval(() => {
        setProgressTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  }, [pending]);

  return (
    <button
      className={styles.button}
      ref={buttonRef}
      disabled={pending}
      {...props}
    >
      {pending ? <div className={styles.loader} /> : children}
    </button>
  );
}
