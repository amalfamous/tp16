import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TRANSACTION } from '../graphql/mutations';
import { GET_ALL_COMPTES, GET_ALL_TRANSACTIONS } from '../graphql/queries';

const CreateTransaction = () => {
  const [compteId, setCompteId] = useState('');
  const [montant, setMontant] = useState('');
  const [type, setType] = useState('DEPOT');
  
  // Récupérer la liste des comptes pour le select
  const { data: comptesData, loading: comptesLoading } = useQuery(GET_ALL_COMPTES);
  
  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [
      { query: GET_ALL_TRANSACTIONS },
      { query: GET_ALL_COMPTES }, // Pour mettre à jour le solde du compte
    ],
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTransaction({
        variables: {
          transaction: {
            compteId: parseInt(compteId),
            montant: parseFloat(montant),
            type,
            date: new Date().toISOString(),
          },
        },
      });
      setCompteId('');
      setMontant('');
      setType('DEPOT');
      alert('Transaction créée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de la transaction :', error);
      alert(`Erreur : ${error.message}`);
    }
  };
  
  if (comptesLoading) {
    return <p>Chargement des comptes...</p>;
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Créer une Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Compte :
          </label>
          <select
            value={compteId}
            onChange={(e) => setCompteId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez un compte</option>
            {comptesData && comptesData.allComptes && comptesData.allComptes.map((compte) => (
              <option key={compte.id} value={compte.id}>
                Compte #{compte.id} - {compte.type} (Solde: {compte.solde}€)
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Montant :
          </label>
          <input
            type="number"
            step="0.01"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
            placeholder="Entrez le montant"
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
            <option value="DEPOT">Dépôt</option>
            <option value="RETRAIT">Retrait</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Créer une transaction
        </button>
      </form>
    </div>
  );
};

export default CreateTransaction;

