import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import theme from "./theme";

import FlightResults from "./components/FlightResults";
import FlightSearch from "./components/FlightSearch";

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearchResults = (results) => {
    if (results?.loading !== undefined) {
      setLoading(results.loading);
    }
    if (results?.data) {
      setSearchResults(results);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 2, maxWidth: 1200, margin: "0 auto" }}>
        <FlightSearch onSearch={handleSearchResults} />
        <FlightResults results={searchResults} loading={loading} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
