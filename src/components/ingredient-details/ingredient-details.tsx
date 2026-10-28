import { getIngredientsSelector } from '@/services/slices/ingredients-slice';
import { useSelector } from '@/services/store';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const ingredients = useSelector(getIngredientsSelector);
  const ingredientData = ingredients.find((ingredient) => ingredient._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
