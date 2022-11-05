//#region imports
import "./App.css";
import { useState } from "react";
import { ChakraProvider, Box, Button } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import Earth3 from "./components/Earth3";
//#endregion

function App() {
    const [wireframe, setWireframe] = useState(false);

    return (
        <ChakraProvider>
            <Box width="100%" height="100%" backgroundColor="#000000">
                <Canvas>
                    <Earth3 wireframe={wireframe} />
                </Canvas>
                <Button display="none" onClick={() => setWireframe(!wireframe)} position="absolute" top="10px" left="10px" hide={true}>
                    Toggle Wireframe
                </Button>
            </Box>
        </ChakraProvider>
    );
}

export default App;
