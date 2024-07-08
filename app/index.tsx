import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';
import axios from 'axios';
import Search from '@/components/SearchBar';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

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
      saveHistory(query);
      setQuery('');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) {
        setHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveHistory = async (query: string) => {
    try {
      const updatedHistory = [query, ...history];
      await AsyncStorage.setItem(
        'searchHistory',
        JSON.stringify(updatedHistory)
      );
      setHistory(updatedHistory);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="my-2 mx-5 space-y-5">
      <Search query={query} setQuery={setQuery} searchNews={searchNews} />
      {/* Display Toggle with History */}
      {history.length > 0 && (
        <Button
          title="Show Search History"
          onPress={() => setShowHistory(!showHistory)}
        />
      )}
      {showHistory && (
        <View className="flex-row flex-wrap">
          {history.map((item, index) => (
            <Button key={index} title={item} onPress={() => setQuery(item)} />
          ))}
        </View>
      )}

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
