import {useQuery} from "@tanstack/react-query";
import {API_URL} from "../../constants";


const getDataDictionariesUSL = async () => {
    const res = await fetch(`${API_URL}/usl/data_dictionary/data_dictionaries_usl`);
    const jsonData = await res.json();
    return jsonData ?? [];
};

const getDataDictionaryTermsUSL = async () => {
    const res = await fetch(`${API_URL}/usl/data_dictionary/data_dictionary_terms_usl`);
    const jsonData = await res.json();
    return jsonData ?? [];
};
const getDataDictionaries = async () => {
    const res = await fetch(`${API_URL}/data_dictionary/data_dictionaries`);
    const jsonData = await res.json();
    return jsonData ?? [];
};

const getDataDictionaryTerms = async () => {
    const res = await fetch(`${API_URL}/data_dictionary/data_dictionary_terms`);
    const jsonData = await res.json();
    return jsonData ?? [];
};

const getDataDictionaryTerm = async ({queryKey}) => {
    const [, id] = queryKey;
    const res = await fetch(`${API_URL}/data_dictionary/data_dictionary_terms/${id}`)
    const jsonData = await res.json();
    return jsonData ?? [];
};

const getDataDictionaryTermUSL = async ({queryKey}) => {
    const [, id] = queryKey;
    const res = await fetch(`${API_URL}/usl/data_dictionary/data_dictionary_terms_usl/${id}`)
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

export const useGetDataDictionaryTermUSL = (id) => useQuery({
    queryKey: ['data_dictionary_term_usl', id],
    queryFn: getDataDictionaryTermUSL,
    enabled: !!id
});
