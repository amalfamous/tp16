import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_COMPTES } from "../graphql/queries";

const CompteList = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_COMPTES, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });
  
  if (loading) return <p>Chargement...</p>;
  if (error) {
    console.error('Erreur lors du chargement des comptes:', error);
    return <p>Erreur : {error.message}</p>;
  }
  
  return (
    <div>
      <h2>Liste des Comptes</h2>
      {data && data.allComptes && data.allComptes.length > 0 ? (
        data.allComptes.map((compte) => {
          let dateFormatted = 'Non définie';
          try {
            if (compte.dateCreation) {
              dateFormatted = new Date(compte.dateCreation).toLocaleDateString('fr-FR');
            }
          } catch (e) {
            console.error('Erreur de formatage de date:', e);
          }
          return (
            <div key={compte.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <p className="font-semibold">ID: {compte.id}</p>
              <p>Solde: {compte.solde}€</p>
              <p>Date de création: {dateFormatted}</p>
              <p>Type: {compte.type}</p>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500">Aucun compte trouvé.</p>
      )}
    </div>
  );
};

export default CompteList;