import React, { useState } from 'react';
import { View, FlatList, Text, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Search from '@/components/SearchBar';
import { Link } from 'expo-router';

type Article = {
  title: string;
  description: string;
  url: string;
  source: {
    name: string;
  };
};

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const searchNews = async () => {
    if (!query) {
      Alert.alert('Please enter a search term');
      return;
    }
    setLoading(true);

    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.EXPO_PUBLIC_API_KEY}`
      );
      setArticles(response.data.articles);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="my-2 mx-5 space-y-5">
      <Search query={query} setQuery={setQuery} searchNews={searchNews} />
      {loading ? (
        <ActivityIndicator size="large" color="#c4b5fd" />
      ) : (
        <FlatList
          data={articles}
          renderItem={({ item }) =>
            item.title === '[Removed]' ? null : (
              <Link href={item.url}>
                <View className="my-2 border border-gray-200 p-2 rounded-lg">
                  <Text className="text-sm text-gray-500">
                    {item.source.name}
                  </Text>
                  <Text className="font-bold text-lg leading-5">
                    {item.title}
                  </Text>
                  <Text>{item.description}</Text>
                </View>
              </Link>
            )
          }
        />
      )}
    </View>
  );
};

export default SearchScreen;
