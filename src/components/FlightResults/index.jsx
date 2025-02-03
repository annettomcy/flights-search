import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

import FlightCard from "./FlightCard";

const LoadingSkeleton = () => (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h6" gutterBottom>
      <Skeleton width={120} />
    </Typography>
    <Stack spacing={2}>
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box>
                  <Skeleton width={120} />
                  <Skeleton width={80} />
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Skeleton width={80} />
                <Skeleton width={100} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  </Box>
);

const FlightResults = ({ results, loading }) => {
  if (loading) return <LoadingSkeleton />;

  if (results?.error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {results.error.message ||
            "Something went wrong while searching for flights. Please try again."}
        </Alert>
      </Box>
    );
  }

  if (results?.data?.itineraries?.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="info">
          <AlertTitle>No Flights Found</AlertTitle>
          We couldn&apos;t find any flights matching your search criteria.
          Please try different dates or locations.
        </Alert>
      </Box>
    );
  }

  if (!results?.data?.itineraries) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Flight Results
      </Typography>
      <Stack spacing={2}>
        {results.data.itineraries.map((itinerary) => (
          <FlightCard key={itinerary.id} itinerary={itinerary} />
        ))}
      </Stack>
    </Box>
  );
};

FlightResults.propTypes = {
  results: PropTypes.shape({
    data: PropTypes.shape({
      itineraries: PropTypes.array,
    }),
    error: PropTypes.shape({
      message: PropTypes.string,
    }),
  }),
  loading: PropTypes.bool,
};

export default FlightResults;
