import { Grid2 } from "@mui/material";
import { RankTagMainProps, RankTagProps } from "../../../interfaces";
import "../css/tag.css";

const RankTagMain: React.FC<RankTagMainProps> = ({ tags }) => {
  return (
    <Grid2>
      {Array.from(tags).map(([key, value]) => (
        <RankTag tag={value}></RankTag>
      ))}
    </Grid2>
  );
};

const RankTag: React.FC<RankTagProps> = ({ tag }) => {
  return (
    <button className={`${tag.cssName}`}>
      <span>{tag.label}</span>
    </button>
  );
};

export default RankTagMain;
