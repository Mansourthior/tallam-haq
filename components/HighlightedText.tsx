import React from 'react';
import { Text, View } from 'react-native';

// @ts-ignore
export const HighlightedText = ({ text, search }) => {
  if (!search) return <Text>{text}</Text>;

  const parts = text.split(new RegExp(`(${search})`, 'gi'));

  return (
    <Text>
      {parts.map(
        // @ts-ignore
        (part, index) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <Text key={index} className='bg-yellow-300 dark:text-black'>{part}</Text>
          ) : (
            part
          )
      )}
    </Text>
  );
};
