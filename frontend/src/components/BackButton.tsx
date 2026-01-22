import { useNavigate } from "react-router-dom";
import "../Styles/BackButton.css";

interface BackButtonProps {
  to?: string;
  label?: string;
}

const BackButton = ({ to, label = "← Back" }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back in history
    }
  };

  return (
    <button className="back-button" onClick={handleClick}>
      {label}
    </button>
  );
};

export default BackButton;
