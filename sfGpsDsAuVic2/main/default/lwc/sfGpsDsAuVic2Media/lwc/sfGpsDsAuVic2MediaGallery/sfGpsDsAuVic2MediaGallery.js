import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2MediaGallery extends LightningElement {
  @api id;
  @api items;
  @api className;

  @track showModal = false;
  @track activeImageSlide = 0;
  @track activeModalImageSlide = 0;
  @track activeContentSlide = 0;
  @track activeModalContentSlide = 0;

  get computedClassName() {
    return computeClass({
      "rpl-media-gallery": true,
      [this.className]: this.className
    });
  }

  get decoratedImageItems() {
    if (!Array.isArray(this.items)) {
      return [];
    }

    const rv = this.items.map((item, index) => ({
      key: `thumbnail-${index + 1}`,
      title: item.title,
      caption: item.caption,
      image: {
        src: item.thumbnail,
        alt: item.alt,
        aspect: { xs: "wide" },
        sizes: "xs:768px"
      },
      describedBy:
        `primary-${this.id}-${index + 1}-title` +
        (item.caption ? ` primary-${this.id}-${index + 1}-caption` : "")
    }));
    console.log("decoratedThumbnailItems", JSON.parse(JSON.stringify(rv)));
    return rv;
  }

  get decoratedContentItems() {
    if (!Array.isArray(this.items)) {
      return [];
    }

    const rv = this.items.map((item, index) => ({
      key: `primary-${this.id}-${index + 1}`,
      id: `primary-${this.id}-${index + 1}`,
      title: item.title,
      caption: item.caption,
      image: {
        src: item.thumbnail,
        alt: item.alt
      }
    }));
    console.log("decoratedImageItems", JSON.parse(JSON.stringify(rv)));
    return rv;
  }

  get decoratedModalImageItems() {
    if (!Array.isArray(this.items)) {
      return [];
    }

    return this.items.map((item, index) => ({
      ...item,
      key: `modal-image-${index + 1}`,
      title: item.title,
      caption: item.caption,
      image: {
        src: item.image,
        alt: item.alt,
        fit: "contain"
      },
      describedBy:
        `gallery-${this.id}-${index + 1}-caption` +
        (item.caption ? ` gallery-${this.id}-{index + 1}-caption` : "")
    }));
  }

  get decoratedModalContentItems() {
    if (!Array.isArray(this.items)) {
      return [];
    }

    return this.items.map((item, index) => ({
      id: `gallery-${this.id}-${index + 1}`,
      key: `modal-gallery-${index + 1}`,
      title: item.title,
      caption: item.caption,
      image: {
        src: item.image,
        alt: item.alt
      }
    }));
  }

  get computedChangeNotice() {
    return Array.isArray(this.items)
      ? this.items[this.activeContentSlide].title
      : null;
  }

  get computedModalChangeNotice() {
    return Array.isArray(this.items)
      ? this.items[this.activeModalContentSlide].title
      : null;
  }

  handleContentSlideUpdate(event) {
    this.activeImageSlide = event.value;
    this.handleChange(event);
  }

  handleModalContentSlideUpdate(event) {
    this.activeModalImageSlide = event.value;
    this.handleChange(event);
  }

  handleImageSlideUpdate(event) {
    this.activeContentSlide = event.value;
    this.handleChange(event);
  }

  handleModalImageSlideUpdate(event) {
    this.activeModalContentSlide = event.value;
    this.handleChange(event);
  }

  handleChange(event) {
    this.dispatchEvent(
      new CustomEvent(event.type, {
        detail: {
          action: event.detail.action,
          text: event.detail.text,
          label: this.items[event.detail.value].title,
          index: event.detail.value + 1
        },
        bubble: true
      })
    );
  }

  handleToggleModal(event) {
    this.showModal = !this.showModal;

    if (this.showModal) {
      this.activeModalImageSlide = this.activeImageSlide;
      this.activeModalContentSlide = this.activeContentSlide;
    }

    this.dispatchEvent(
      new CustomEvent("viewfullscreen", {
        detail: {
          action: this.showModal ? "enter" : "exit",
          text: event.detail.text,
          label: this.items[this.activeModalImageSlide]?.title,
          index: this.activeImageSlide + 1
        },
        bubble: true
      })
    );
  }

  handleKeyboardNavigation(event) {
    if (!this.showModal) return;

    if (event.key === "ArrowLeft" && this.activeModalImageSlide > 0) {
      this.activeModalImageSlide = this.activeModalImageSlide - 1;
    } else if (
      event.key === "ArrowRight" &&
      this.activeModalImageSlide < this.items.length - 1
    ) {
      this.activeModalImageSlide = this.activeModalImageSlide + 1;
    }
  }
}
