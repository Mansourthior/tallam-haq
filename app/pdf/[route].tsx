import { useLocalSearchParams } from "expo-router";
import WebView from "react-native-webview";

export default function PdfViewerScreen() {

    const { route } = useLocalSearchParams();

    // @ts-ignore
    const handleRequest = (event) => {
        if (event.url.includes("export=download"))
            return false;

        return true;
    };


    return (
        // @ts-ignore
        <WebView source={{ uri: route }} style={{ flex: 1 }} onShouldStartLoadWithRequest={handleRequest} />
    );
}