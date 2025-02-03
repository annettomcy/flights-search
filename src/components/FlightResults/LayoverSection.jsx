import { Box, Divider, Typography } from "@mui/material";
import PropTypes from "prop-types";

const LayoverSection = ({ segments }) => {
  if (segments.length <= 1) return null;

  const calculateLayoverDuration = (currentSegment, nextSegment) => {
    const duration =
      new Date(nextSegment.departure) - new Date(currentSegment.arrival);
    return {
      hours: Math.floor(duration / (1000 * 60 * 60)),
      minutes: Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60)),
    };
  };

  return (
    <Box sx={{ ml: 4, my: 1 }}>
      <Divider>
        <Typography variant="caption" color="text.secondary">
          {segments.length - 1} Layover{segments.length > 2 ? "s" : ""}
        </Typography>
      </Divider>
      {segments.slice(0, -1).map((segment, idx) => {
        const { hours, minutes } = calculateLayoverDuration(
          segment,
          segments[idx + 1]
        );

        return (
          <Box key={segment.id} sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {hours}h {minutes}m layover in {segment.destination.parent.name} (
              {segment.destination.displayCode})
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

LayoverSection.propTypes = {
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      arrival: PropTypes.string,
      departure: PropTypes.string,
      destination: PropTypes.shape({
        displayCode: PropTypes.string,
        parent: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
    })
  ).isRequired,
};

export default LayoverSection;
