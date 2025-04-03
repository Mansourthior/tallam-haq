import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, useColorScheme, View } from 'react-native';
import Pdf from 'react-native-pdf';

export default function PdfViewerScreen() {
    const colorScheme = useColorScheme();
    const { route } = useLocalSearchParams();
    const navigation = useNavigation();

    useEffect(() => {
        // @ts-ignore
        const namePdf = route.trim().split('/').slice(-1)[0];
        const title = namePdf.split('_').join(' ').slice(0, -4);
        navigation.setOptions({ headerTitle: title });
    })

    return (
        <SafeAreaView className="flex-1">
            <Pdf
                source={{ uri: `${route}` }}
                style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}
                enablePaging={true}
            />
        </SafeAreaView>
    );

}