import { Grid2 } from "@mui/material";
import {
  RankTagMainProps,
  RankTagProps,
  RankValueProps,
} from "../../../interfaces";
import "../css/tag.css";

const RankTagMain: React.FC<RankTagMainProps> = ({ tags }) => {
  return (
    <Grid2>
      <RankTag rank={tags.get("topgoalscorer")} label="Artilheiro" />
      <RankTag rank={tags.get("topassist")} label="Assistência" />
      <RankTag rank={tags.get("toppart")} label="Participação" />
      <RankValue value={Number(tags.get("goals"))} />
    </Grid2>
  );
};

const RankTag: React.FC<RankTagProps> = ({ rank, label }) => {
  if (!rank) return null;

  const rankTextMap: Record<
    string,
    { label: string; bgColor: string; txtColor: string; cssName: string }
  > = {
    "🥇": {
      label: `TOP 1 ${label}`,
      bgColor: "#d4af37",
      txtColor: "black",
      cssName: "special-class",
    },
    "🥈": {
      label: `TOP 2 ${label}`,
      bgColor: "#c0c0c0",
      txtColor: "black",
      cssName: "second-class",
    },
    "🥉": {
      label: `TOP 3 ${label}`,
      bgColor: "#cd7f32",
      txtColor: "black",
      cssName: "third-class",
    },
  };
  const rankText = rankTextMap[rank];

  return (
    <button className={`${rankText.cssName}`}>
      <span>{rankText.label}</span>
    </button>
  );
};

const RankValue: React.FC<RankValueProps> = ({ value }) => {
  if (!value) return null;

  const thresholds: {
    [key: number]: { label: string; bgColor: string; txtColor: string };
  } = {
    20: { label: "20+ Gols", bgColor: "#d4af37", txtColor: "black" },
    10: { label: "10+ Gols", bgColor: "#c0c0c0", txtColor: "black" },
    5: { label: "5+ Gols", bgColor: "#cd7f32", txtColor: "black" },
  };

  // Find the highest threshold the value satisfies
  const thresholdKey = Object.keys(thresholds)
    .map(Number)
    .sort((a, b) => b - a) // Sort descending
    .find((threshold) => value > threshold);

  if (!thresholdKey) return null;

  const thresh = thresholds[thresholdKey];

  // Styles
  const tagStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: thresh.bgColor, // Light teal or gray
    color: thresh.txtColor, // Dark teal or neutral gray
    padding: "4px 12px",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: "500",
    margin: "4px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    cursor: "default",
  };

  return <div style={tagStyle}>{thresh.label}</div>;
};

export default RankTagMain;
