import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { ICartItem } from './interface/ICartItem';
import { ICategory } from './interface/ICategory';
import { Divider, ListItemSecondaryAction, IconButton, Dialog, TextField, DialogTitle, DialogContent, DialogActions, Button, Typography, Tooltip, Avatar, Box } from '@mui/material';
import { Add, Delete, Remove, ShoppingCart } from '@mui/icons-material';
import styled from '@emotion/styled';

const QuantityInput = styled(TextField)`
  & input[type=number] {
    -moz-appearance: textfield;
  }
  & input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  & input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ListItemSecondaryActionStyled = styled(ListItemSecondaryAction)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2px;
  max-width: 300px;

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 1px;
  }
`;

const IconButtonStyled = styled(IconButton)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50%;
`;

const ListItemTextStyled = styled(ListItemText)`
  max-width: 40%;
`;

interface ICarritoProps {
  carrito: ICartItem[];
  setCarrito: React.Dispatch<React.SetStateAction<ICartItem[]>>;
  SLS: (carrito: ICartItem[]) => void;
}

export const Carrito: React.FC<ICarritoProps> = ({ carrito, setCarrito, SLS }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<ICartItem | null>(null);
  const [price,setPrice] = useState<number>(0.00);
  const txtComprar = 'Comprar';
  const NUMERO_TELEFONO = '5355135638'; 
  const WHATSAPP_URL = 'https://wa.me';
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setItemToRemove(null);
  };

  const handleRemoveItem = () => {
    if (itemToRemove) {
      setCarrito(prevCarrito => {
        const localCarrito = prevCarrito.filter(item => item.item.id !== itemToRemove.item.id);
        SLS(localCarrito);
        return localCarrito;
      });
      handleCloseDialog();
    }
  };

  const handleAdjustQuantity = (item: ICartItem, amount: number) => {
    const updatedCarrito = carrito.map(cartItem =>
      cartItem.item.id === item.item.id ? { ...cartItem, quantity: cartItem.quantity + amount } : cartItem
    );
    setCarrito(updatedCarrito);
    SLS(updatedCarrito);
  };

  const confirmRemoveItem = (item: ICartItem) => {
    setItemToRemove(item);
    setOpenDialog(true);
  };

  const getUniqueCategories = (carrito: ICartItem[]): ICategory[] => {
    const uniqueCategories = new Set<number>();
    const categories: ICategory[] = [];
    carrito.forEach(car => {
      const category = car.item.product.category;
      if (!uniqueCategories.has(category.id)) {
        uniqueCategories.add(category.id);
        categories.push(category);
      }
    });
    return categories;
  };
  const handleComprarClick = () => {
    const itemDetails = carrito.map(car => {
      return `*${car.item.product.name}* x ${car.quantity} : *$${(car.quantity * car.item.product.price).toFixed(2)}*`;
    }).join('\n');

    const message = `*PEDIDO*:\n\n${itemDetails}\n\n*Total*: *$${price.toFixed(2)}*`;
    const whatsappLink = `${WHATSAPP_URL}/${NUMERO_TELEFONO}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
   
  };

  useEffect(() => {
    const actualPrice = carrito.reduce((total, car) => total + car.quantity * car.item.product.price, 0);
    setPrice(actualPrice);
  }, [carrito]);

  const categoryUniqueInCart = getUniqueCategories(carrito);

  return (
    <>
      <List
        sx={{
          width: '100%',
          height: '60vh',
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'auto',
          '& ul': { padding: 0 },
          boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.2), -1px 1px 3px rgba(0, 0, 0, 0.2)'
        }}
        subheader={<li />}
      >
        {categoryUniqueInCart.map((category) => (
          <li key={category.id}>
             <Divider component="ul" />
            <ul>
              <ListSubheader>{category.name}</ListSubheader>
              {carrito.map((item) => (
                item.item.product.categoryId === category.id &&
                <ListItem key={item.item.id}>
                   <Avatar
                      alt={item.item.product.name}
                      src={item.item.product.mediaURL}
                      sx={{
                        width: { xs: 50, md: 60 }, // Ancho responsive según el tamaño de la pantalla
                        height: { xs: 50, md: 60 }, // Alto responsive según el tamaño de la pantalla
                        mr:'20px'
                      }}
                    />
                  <ListItemTextStyled 
                    primary={item.item.product.name} 
                    secondary={`${item.item.product.price}$`} 
                    />
                  <ListItemSecondaryActionStyled sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      edge="end"
                      aria-label="remove"
                      onClick={() => handleAdjustQuantity(item, -1)}
                      disabled={item.quantity <= 1}
                      sx={{mr:'2px'}}
                    >
                      <Remove />
                    </IconButton>
                    <QuantityInput
                      variant="outlined"
                      size="small"
                      type="number"
                      
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        if (!isNaN(newQuantity) && newQuantity >= 1) {
                          handleAdjustQuantity(item, newQuantity - item.quantity);
                        }
                      }}
                      sx={{ width: '15%', textAlign: 'center', }}
                    />
                    <IconButton
                      edge="end"
                      aria-label="add"
                      onClick={() => handleAdjustQuantity(item, 1)}
                      
                    >
                      <Add />
                    </IconButton>
                    <Tooltip title='Eliminar del carrito'>
                    <IconButtonStyled
                      sx={{ color: /*'#ff149c'*/'red',"&:hover": { color: '#000'}, }}
                      edge="end"
                      aria-label="delete"
                      onClick={() => confirmRemoveItem(item)}
                    >
                      <Delete />
                    </IconButtonStyled>
                    </Tooltip>
                  </ListItemSecondaryActionStyled>
                </ListItem>
              ))}
            </ul>
           
          </li>
        ))}
      </List>
      <Box
      
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: '100%', height: '10vh' }}
    >
        <Typography variant="h6" component="span" marginLeft={2}>
        {`$${price}.00`}
      </Typography>
      <Box>
        <Button variant="contained" 
          sx = {{bgcolor: '#f44685', '&:hover': {bgcolor: /*'#f44685'*/ '#000'}}} 
          onClick={handleComprarClick} 
         >
        
        <ShoppingCart fontSize="small" />
         {txtComprar}
        </Button>
      </Box>
     
    </Box>


      {/*Cuadro de dialogo para eliminar un item */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro que deseas eliminar este item del carrito?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleRemoveItem} color="primary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
