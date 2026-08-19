/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { generateStarsInputs } from '../../../lib/functions';
import { useFilePreview } from '../../../lib/customHooks';
import addFileIMG from '../../../images/add_file.png';
import styles from './BookForm.module.css';
import { updateBook, addBook } from '../../../lib/common';
import { APP_ROUTES } from '../../../utils/constants';

function BookForm({ book, validate }) {
  const userRating = book ? book.ratings.find((elt) => elt.userId === localStorage.getItem('userId'))?.grade : 0;

  const [rating, setRating] = useState(0);

  const navigate = useNavigate();
  const {
    register, watch, handleSubmit, reset,
  } = useForm({
    defaultValues: useMemo(() => ({
      title: book?.title,
      author: book?.author,
      year: book?.year,
      genre: book?.genre,
    }), [book]),
  });
  useEffect(() => {
    reset(book);
  }, [book]);
  const file = watch(['file']);
  const [filePreview] = useFilePreview(file);

  useEffect(() => {
    setRating(userRating);
  }, [userRating]);

  const onSubmit = async (data) => {
    // When we create a new book
    if (!book) {
      const selectedFile = data.file?.[0];

      if (!selectedFile) {
        alert('Vous devez ajouter une image');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
        alert('Format non autorisé. Utilisez une image JPEG, PNG ou WebP.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('L\'image est trop volumineuse. La taille maximale est de 5 Mo.');
        return;
      }
      const newBook = await addBook(data);
      if (!newBook.error) {
        validate(true);
      } else if (newBook.status === 401) {
        alert('Votre session a expiré. Veuillez vous reconnecter.');
        navigate(APP_ROUTES.SIGN_IN);
      } else {
        alert(newBook.message);
      }
    } else {
      const updatedBook = await updateBook(data, data.id);
      if (!updatedBook.error) {
        navigate('/');
      } else {
        alert(updatedBook.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.Form}>
      <input type="hidden" id="id" {...register('id')} />
      <label htmlFor="title">
        <p>Titre du livre</p>
        <input type="text" id="title" {...register('title', { required: true })} />
      </label>
      <label htmlFor="author">
        <p>Auteur</p>
        <input type="text" id="author" {...register('author', { required: true })} />
      </label>
      <label htmlFor="year">
        <p>Année de publication</p>
        <input type="text" id="year" {...register('year', { required: true })} />
      </label>
      <label htmlFor="genre">
        <p>Genre</p>
        <input type="text" id="genre" {...register('genre', { required: true })} />
      </label>
      {book && (
        <label htmlFor="rate">
          <p>Note</p>
          <div className={styles.Stars}>
            {generateStarsInputs(rating, register, true)}
          </div>
        </label>
      )}
      <label htmlFor="file">
        <p>Visuel</p>
        <div className={styles.AddImage}>
          {filePreview || book?.imageUrl ? (
            <>
              <img src={filePreview ?? book?.imageUrl} alt="preview" />
              <p>Modifier</p>
            </>
          ) : (
            <>
              <img src={addFileIMG} alt="Add file" />
              <p>Ajouter une image</p>
            </>
          )}

        </div>
        <input
          {...register('file', { required: !book })}
          type="file"
          id="file"
          accept="image/jpeg,image/png,image/webp"
        />
      </label>
      <button type="submit">Publier</button>
    </form>
  );
}

BookForm.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string,
    _id: PropTypes.string,
    userId: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    year: PropTypes.number,
    imageUrl: PropTypes.string,
    genre: PropTypes.string,
    ratings: PropTypes.arrayOf(PropTypes.shape({
      userId: PropTypes.string,
      grade: PropTypes.number,
    })),
    averageRating: PropTypes.number,
  }),
  validate: PropTypes.func,
};

BookForm.defaultProps = {
  book: null,
  validate: null,
};
export default BookForm;
