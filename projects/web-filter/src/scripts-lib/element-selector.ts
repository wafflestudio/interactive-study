import { STATUS } from '../types/status';
import {
  ThemeType,
  cleanupOverlayElement,
  createOverlayElement,
  getThemeColor,
  highlightElement,
  updateOverlayStyle,
} from './utils';

// TODO: 리스너 해제 연결, 초기화
// TODO: selected element 정보 popup에 전달 🚨 (for preview)
// TODO: 화면에서 기존 요소와의 인터랙션을 불가능하게 하기 🚨
// TODO: 탭간 이동시 초기화 🚨

export class ElementSelector {
  private OVERLAY_ID = 'web_filter_overlay_element';

  private status: STATUS = STATUS.INACTIVE;
  private selectedElement: HTMLElement | null = null;
  private styleSheet: HTMLStyleElement | null = null;
  private currentTheme: ThemeType = 'default';
  private overlay: HTMLElement | null = null;

  constructor() {
    this.bindEvents();
  }

  private setStatus(status: STATUS) {
    this.status = status;
  }

  private createOverlay = () => {
    // 기존 오버레이 제거
    if (this.overlay && document.body.contains(this.overlay)) {
      document.body.removeChild(this.overlay);
    }

    const overlay = createOverlayElement(this.OVERLAY_ID);
    this.styleSheet = updateOverlayStyle(
      overlay,
      this.currentTheme,
      this.styleSheet,
    );

    this.overlay = overlay;
    return overlay;
  };

  /**
   * @description
   *
   * event handlers
   */

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.cleanupOverlay();
      this.setStatus(STATUS.INACTIVE);
      this.selectedElement = null;
    }
  };

  private handleScroll = () => {
    if (this.overlay && this.selectedElement) {
      const rect = this.selectedElement.getBoundingClientRect();
      this.overlay.style.left = `${rect.left}px`;
      this.overlay.style.top = `${rect.top}px`;
      this.overlay.style.width = `${rect.width}px`;
      this.overlay.style.height = `${rect.height}px`;
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (this.status !== STATUS.SURFING) return;

    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element) return;

    const overlay =
      document.getElementById(this.OVERLAY_ID) || this.createOverlay();

    const rect = element.getBoundingClientRect();
    overlay.style.left = `${rect.left}px`;
    overlay.style.top = `${rect.top}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;

    highlightElement(overlay);
  };

  private handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element || !(element instanceof HTMLElement)) return;

    if (this.selectedElement && this.selectedElement !== element) {
      this.selectedElement = null;
      this.setStatus(STATUS.SURFING);
      return;
    }

    this.selectedElement = element;
    this.setStatus(STATUS.SELECTED);

    if (this.overlay) {
      this.overlay.style.border =
        '2px solid ' + getThemeColor(this.currentTheme);
    }
  };

  private bindEvents = () => {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
  };

  /**
   * @description
   *
   * public methods
   */
  public surfingElements = () => {
    this.setStatus(STATUS.SURFING);
  };

  public applyFilter(filterId: string) {
    if (!this.selectedElement) return;
    this.selectedElement.style.filter = `url(#${filterId})`;
  }

  public cleanupOverlay = () => {
    cleanupOverlayElement(this.styleSheet, this.overlay);
    this.styleSheet = null;
    this.overlay = null;
  };

  public destroy = () => {
    this.cleanupOverlay();

    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
  };
}
