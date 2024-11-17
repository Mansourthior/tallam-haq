import React from 'react';
import { View, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';

// @ts-ignore
const PdfViewer = ({ pdfUri }) => {
  const source = { uri: pdfUri, cache: false };

  return (
    <View style={{ flex: 1 }}>
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Nombre de pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Page: ${page}/${numberOfPages}`);
        }}
        onError={(error) => {
          console.error(error);
          // TODO : créer composant notif error
        }}
        style={{ flex: 1, width: Dimensions.get('window').width }}
      />
    </View>
  );
};

export default PdfViewer;
