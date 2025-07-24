import styled from "styled-components";

const ButtonStyled = styled.button`
  padding: 10px 12px;
  border-radius: var(--radius-normal);
  cursor: pointer;
  color: ${({ $color }) => $color || "var(--color-white)"};
  border: var(--border-normal);
  background-color: ${({ $backgroundColor }) =>
    $backgroundColor || "var(--color-primary)"};
  border-color: ${({ $backgroundColor }) =>
    $backgroundColor || "var(--color-primary)"};
  width: ${({ $width }) => $width || "fit-content"};

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  width = "fit-content",
  backgroundColor = "var(--color-primary)",
  color = "var(--color-white)",
}) => {
  return (
    <ButtonStyled
      type={type}
      onClick={onClick}
      disabled={disabled}
      $width={width}
      $backgroundColor={backgroundColor}
      $color={color}
    >
      {children}
    </ButtonStyled>
  );
};

export default Button;
