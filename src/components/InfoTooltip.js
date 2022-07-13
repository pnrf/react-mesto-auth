function InfoTooltip({image, message, isOpen, onClose}) {
  return (
    <section className={`popup popup_type_infoTooltip ${isOpen && 'popup_opened'}`}>
      <figure className="popup__container">
        <button onClick={onClose} className="popup__close-button" type="button"></button>
        <img src={image} alt={`Информационное сообщение: ${message}`} className="popup__image" />
        <figcaption className="popup__figcaption">{message}</figcaption>
      </figure>
    </section>
  );
};

export default InfoTooltip;
