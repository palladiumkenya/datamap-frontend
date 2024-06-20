import {useQuery} from "@tanstack/react-query";


const getDataDictionariesUSL = async () => {
    const res = await fetch('http://localhost:8000/api/data_dictionary/data_dictionaries_usl');
    const jsonData = await res.json();
    return jsonData ?? [];
};

const getDataDictionaryTermsUSL = async () => {
    const res = await fetch('http://localhost:8000/api/data_dictionary/data_dictionary_terms_usl');
    const jsonData = await res.json();
    console.log(jsonData)
    return jsonData ?? [];
};
const getDataDictionaries = async () => {
    const res = await fetch('http://localhost:8000/api/data_dictionary/data_dictionaries');
    const jsonData = await res.json();
    return jsonData ?? [];
};

const getDataDictionaryTerms = async () => {
    const res = await fetch('http://localhost:8000/api/data_dictionary/data_dictionary_terms');
    const jsonData = await res.json();
    return jsonData ?? [];
};

const getDataDictionaryTerm = async ({queryKey}) => {
    const [, id] = queryKey;
    const res = await fetch(`http://localhost:8000/api/data_dictionary/data_dictionary_terms/${id}`)
    const jsonData = await res.json();
    return jsonData ?? [];
};

export const useGetDataDictionariesUSL = () => useQuery({
    queryKey: ['data_dictionaries_usl'],
    queryFn: getDataDictionariesUSL
});

export const useGetDataDictionaryTermsUSL = () => useQuery({
    queryKey: ['data_dictionary_terms_usl'],
    queryFn: getDataDictionaryTermsUSL
});

export const useGetDataDictionaries = () => useQuery({
    queryKey: ['data_dictionaries'],
    queryFn: getDataDictionaries
});

export const useGetDataDictionaryTerms = () => useQuery({
    queryKey: ['data_dictionary_terms'],
    queryFn: getDataDictionaryTerms
});

export const useGetDataDictionaryTerm = (id) => useQuery({
    queryKey: ['data_dictionary_term', id],
    queryFn: getDataDictionaryTerm,
    enabled: !!id
});