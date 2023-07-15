import React from 'react';
import CommentsSection from "./components/CommentsSection";
import { Provider } from 'react-redux';
import {store} from "./store/store";
import {Container, CssBaseline} from "@mui/material";

function App() {

  return (
    <Provider store={store}>
        <CssBaseline />
        <Container maxWidth={"lg"}>
            <CommentsSection />
        </Container>
    </Provider >
  );
}

export default App;
