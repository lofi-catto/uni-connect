function TextButton({ buttonText, onClick, id }) {
  return (
    <button className="text-button" id={id} type="button" onClick={onClick}>
      {buttonText}
    </button>
  );
}

export default TextButton;
