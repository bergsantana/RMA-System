interface ButtonProps {
  text: string;
  onClickBtn: () => void;
}

export default function Button({ text, onClickBtn, ...props }: ButtonProps) {
  return (
    <button
      className="p-[2px] border-[1px]  border-black bg-white text-black w-28 rounded-lg hover:bg-purple-950 hover:text-white transition-all"
      onClick={onClickBtn}
      {...props}
    >
      {text}
    </button>
  );
}
