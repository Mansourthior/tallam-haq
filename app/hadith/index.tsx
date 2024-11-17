import React from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const HadithScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    En cours de dev
                </Text>

                <View style={styles.messageContainer}>
                    <Text style={styles.message}>
                        Cette fonctionnalité est actuellement en cours de développement.
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 24,
    },
    messageContainer: {
        maxWidth: 320,
        marginTop: 24,
    },
    message: {
        fontSize: 16,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 24,
    },
    subtextContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    subtext: {
        color: '#6B7280',
        fontSize: 14,
    },
    version: {
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: 8,
    },
    button: {
        marginTop: 32,
        backgroundColor: '#2563EB',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default HadithScreen;
