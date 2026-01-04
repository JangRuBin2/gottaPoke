const ExitIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      onClick={onClick}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.8492 4.94975L4.94967 14.8492M4.94967 4.94975L14.8492 14.8492"
        stroke="black"
        strokeOpacity="0.9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ExitIcon;
