import { loadBookmark, saveBookmark } from "@/utils/bookmark";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, useColorScheme, View } from 'react-native';
import Pdf from 'react-native-pdf';

export default function PdfViewerScreen() {
    const colorScheme = useColorScheme();
    const { route } = useLocalSearchParams();
    const navigation = useNavigation();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [initialPage, setInitialPage] = useState<number | null>(null);
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (!route) return;

        // @ts-ignore
        const namePdf = route.trim().split('/').slice(-1)[0];
        const titleFromRoute = namePdf.split('_').join(' ').slice(0, -4);

        setTitle(titleFromRoute);
        navigation.setOptions({ headerTitle: titleFromRoute });

        loadBookmark(titleFromRoute).then((savedPage) => {
            setInitialPage(savedPage || 0);
        });
    }, [route]);


    if (initialPage === null) {
        return (
            <SafeAreaView className="flex-1 bg-white dark:bg-black justify-center items-center">
                <Text className="text-lg text-gray-500 dark:text-gray-300 font-[Poppins]">
                    Chargement du PDF...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <Pdf
                source={{ uri: `${route}` }}
                page={initialPage}
                style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}
                enablePaging={true}
                horizontal={true}
                onPageChanged={(page, numberOfPages) => {
                    setCurrentPage(page);
                    setTotalPages(numberOfPages);
                    saveBookmark(title, page);
                }}
            />

            <View className="absolute bottom-4 w-full items-center">
                <Text className="text-center font-[Poppins] text-black dark:text-white bg-white/70 dark:bg-black/70 px-4 py-1 rounded-full">
                    {currentPage} / {totalPages}
                </Text>
            </View>
        </SafeAreaView>
    );

}