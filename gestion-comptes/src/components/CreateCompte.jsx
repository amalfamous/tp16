import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_COMPTE } from '../graphql/mutations';
import { GET_ALL_COMPTES } from '../graphql/queries';

const CreateCompte = () => {
  const [solde, setSolde] = useState('');
  const [type, setType] = useState('COURANT');
  
  const [saveCompte, { loading: saving }] = useMutation(SAVE_COMPTE, {
    refetchQueries: [{ query: GET_ALL_COMPTES }],
    awaitRefetchQueries: true,
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await saveCompte({
        variables: {
          compte: {
            solde: parseFloat(solde),
            type,
          },
        },
      });
      console.log('Compte créé avec succès:', result);
      setSolde('');
      setType('COURANT');
    } catch (error) {
      console.error('Erreur lors de la création du compte :', error);
      alert(`Erreur : ${error.message}`);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Créer un Compte</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Solde :
          </label>
          <input
            type="number"
            step="0.01"
            value={solde}
            onChange={(e) => setSolde(e.target.value)}
            required
            placeholder="Entrez le solde initial"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type :
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="COURANT">Courant</option>
            <option value="EPARGNE">Épargne</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Création...' : 'Créer un compte'}
        </button>
      </form>
    </div>
  );
};

export default CreateCompte;