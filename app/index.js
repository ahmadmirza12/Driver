import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import BrainBox from "../src/components/BrainBox";
import SocketProvider from "../src/components/SocketProvider";

import Navigation from "../src/navigation/";
import { persistor, store } from "../src/store";
import { COLORS } from "../src/utils/COLORS";

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <BrainBox>
            <Navigation />
          </BrainBox>
        </SocketProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
