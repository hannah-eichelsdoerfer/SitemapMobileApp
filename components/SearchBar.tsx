import { View, Text, TextInput, Button, Pressable } from 'react-native';

type SearchProps = {
  query: string;
  setQuery: (query: string) => void;
  searchNews: () => void;
};

export default function Search({ query, setQuery, searchNews }: SearchProps) {
  return (
    <View className="flex-row justify-between rounded-full border border-violet-500 p-2">
      <TextInput
        placeholder="Search news..."
        value={query}
        onChangeText={setQuery}
        className="mx-5"
      />
      <Pressable
        className="rounded-full bg-violet-300 px-5 py-2 justify-center"
        onPress={searchNews}
      >
        <Text className="text-white">Search</Text>
      </Pressable>
    </View>
  );
}
