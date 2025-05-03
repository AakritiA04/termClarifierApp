import React, { useState } from 'react';
import { Text, TextInput, View, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [term, setTerm] = useState(''); // For storing the user input
  const [definition, setDefinition] = useState(''); // For storing the fetched definition
  const [synonyms, setSynonyms] = useState([]); // For storing the fetched synonyms
  const [loading, setLoading] = useState(false); // For showing loading spinner
  const [error, setError] = useState(''); // For handling errors

  const fetchDefinition = async () => {
    if (!term) {
      setError('Please enter a term');
      return;
    }

    setLoading(true);
    setError('');
    setSynonyms([]); // Clear previous synonyms when a new search is done

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`);
      const data = await response.json();

      if (data.title === 'No Definitions Found') {
        setError('Term not found.');
        setDefinition('');
        setSynonyms([]);
      } else {
        setError('');
        setDefinition(data[0]?.meanings[0]?.definitions[0]?.definition || 'No definition available.');
        setSynonyms(data[0]?.meanings[0]?.synonyms || []); // Assuming synonyms are in the API response
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setDefinition('');
      setSynonyms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.nativeEvent.key === 'Enter') {
      fetchDefinition();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Term Clarifier</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a term"
        value={term}
        onChangeText={setTerm}
        onSubmitEditing={fetchDefinition}  // Trigger on Enter key
        returnKeyType="search"
      />

      {/* Smaller button */}
      <TouchableOpacity style={styles.button} onPress={fetchDefinition}>
        <Text style={styles.buttonText}>Get Definition</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
      ) : (
        <>
          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <>
              {definition && (
                <View style={styles.card}>
                  <Text style={styles.definition}>Definition: {definition}</Text>
                </View>
              )}
              {synonyms.length > 0 && (
                <View style={styles.card}>
                  <Text style={styles.synonymHeading}>Synonyms:</Text>
                  <Text style={styles.synonyms}>
                    {synonyms.join(', ')}
                  </Text>
                </View>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Start from the top
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30, // Heading closer to top
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 8, // Smaller padding for the button
    paddingHorizontal: 20, // Smaller button size
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16, // Smaller text for the button
  },
  card: {
    marginTop: 30, // Definition comes below the button
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  definition: {
    fontSize: 16,
    color: '#333',
  },
  synonymHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  synonyms: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  spinner: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
