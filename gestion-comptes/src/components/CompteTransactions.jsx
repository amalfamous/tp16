import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COMPTE_TRANSACTIONS, GET_ALL_COMPTES } from '../graphql/queries';

const CompteTransactions = () => {
  const [selectedCompteId, setSelectedCompteId] = useState('');
  
  // Récupérer la liste des comptes
  const { data: comptesData, loading: comptesLoading } = useQuery(GET_ALL_COMPTES);
  
  // Récupérer les transactions du compte sélectionné
  const { loading, error, data } = useQuery(GET_COMPTE_TRANSACTIONS, {
    variables: { id: selectedCompteId },
    skip: !selectedCompteId, // Ne pas exécuter la requête si aucun compte n'est sélectionné
  });
  
  if (comptesLoading) {
    return <p className="text-gray-600">Chargement des comptes...</p>;
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Transactions par Compte</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionnez un compte :
        </label>
        <select
          value={selectedCompteId}
          onChange={(e) => setSelectedCompteId(e.target.value)}
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
      
      {!selectedCompteId ? (
        <p className="text-gray-500 text-sm">Veuillez sélectionner un compte pour voir ses transactions.</p>
      ) : (
        <>
          {loading && <p className="text-gray-600">Chargement des transactions...</p>}
          {error && <p className="text-red-600">Erreur : {error.message}</p>}
          {data && data.compteTransactions && data.compteTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.compteTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.type === 'DEPOT' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.montant}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {transaction.date 
                          ? new Date(transaction.date).toLocaleString('fr-FR')
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : data && data.compteTransactions && data.compteTransactions.length === 0 ? (
            <p className="text-gray-600">Aucune transaction trouvée pour ce compte.</p>
          ) : null}
        </>
      )}
    </div>
  );
};

export default CompteTransactions;

