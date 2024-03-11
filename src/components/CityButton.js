const CityButton = ({ name, onClick, isLastChild, isSelected }) => {
  const buttonStyle = {
    backgroundColor: isSelected ? "#a1b78c" : "#cedbb4",
    fontSize: "medium",
    borderRadius: "7.5px",
    padding: "3.5px 10px",
    margin: "0 10px 10px 0",
  };
  buttonStyle.marginRight = isLastChild ? 0 : 10;

  return (
    <button style={buttonStyle} onClick={onClick}>
      {name}
    </button>
  );
};

export default CityButton;
