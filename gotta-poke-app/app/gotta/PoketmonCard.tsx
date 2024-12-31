const PoketmonCard = ({
  poketmonInfo: poke,
}: {
  poketmonInfo: PoketmonInfo;
}) => {
  return <div>{poke.name}</div>;
};

export default PoketmonCard;
