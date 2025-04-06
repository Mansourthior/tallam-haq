import { Share } from "react-native";

export const onShare = async (hadith: any) => {
    try {
        const result = await Share.share({
            message: hadith.hadith_text_ar + '\n\n\n' +
                hadith.hadith_text + ' ' + hadith.grade + ' ' + hadith.takhrij
            // + "\n Découvrez cette superbe application ! 📱✨\nTéléchargez-la ici : https://example.com",
        });

        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                console.log("Partagé via", result.activityType);
            } else {
                console.log("Partage réussi !");
            }
        } else if (result.action === Share.dismissedAction) {
            console.log("Partage annulé");
        }
    } catch (error) {
        console.error("Erreur lors du partage :", error);
    }
};