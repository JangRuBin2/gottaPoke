const LeftArrowIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <div onClick={onClick}>
      <svg
        width="8"
        height="14"
        viewBox="0 0 8 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 1L1 7L7 13"
          stroke="#465978"
          strokeOpacity="0.94"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default LeftArrowIcon;
