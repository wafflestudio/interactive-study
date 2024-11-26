import { STATUS } from '../types/status';
import { overlayStyles } from './element-selector.styles';

export class ElementSelector {
  private status: STATUS = STATUS.INACTIVE;
  private selectedElement: Element | null = null;
  private styleSheet: HTMLStyleElement | null = null;
  private currentTheme: keyof typeof overlayStyles.themes = 'default';
  private overlay: HTMLElement | null = null;

  constructor() {
    this.bindEvents();
  }

  private setStatus(status: STATUS) {
    this.status = status;
    this.notifyPopup();
  }

  private notifyPopup() {
    chrome.runtime.sendMessage({
      status: this.status,
      selectedElement: this.selectedElement ?? null,
    });
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (this.status !== STATUS.SURFING) return;

    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element) return;

    const overlay =
      document.getElementById('web_filter_overlay_element') ||
      this.createOverlay();

    const rect = element.getBoundingClientRect();
    overlay.style.left = `${rect.left}px`;
    overlay.style.top = `${rect.top}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;

    this.highlightElement(overlay);
  };

  private createOverlay = () => {
    // 기존 오버레이 제거
    if (this.overlay && document.body.contains(this.overlay)) {
      document.body.removeChild(this.overlay);
    }

    const overlay = document.createElement('div');
    overlay.id = 'web_filter_overlay_element';

    this.updateOverlayStyle(overlay);

    document.body.appendChild(overlay);
    this.overlay = overlay;
    return overlay;
  };

  private updateOverlayStyle(overlay: HTMLElement) {
    // 기존 스타일시트 제거
    if (this.styleSheet && document.head.contains(this.styleSheet)) {
      document.head.removeChild(this.styleSheet);
    }

    const theme = overlayStyles.themes[this.currentTheme];

    // 새 스타일시트 생성 및 적용
    this.styleSheet = document.createElement('style');
    this.styleSheet.textContent = theme.keyframes;
    document.head.appendChild(this.styleSheet);

    // 오버레이에 스타일 적용
    overlay.style.cssText = overlayStyles.base + theme.style;
    overlay.style.animation = 'pulse 2s infinite';
  }

  private highlightElement = (overlay: HTMLElement) => {
    overlay.style.transform = 'scale(1.03)';
    setTimeout(() => (overlay.style.transform = 'scale(1)'), 200);
  };

  private handleClick = (e: MouseEvent) => {
    if (this.status !== STATUS.SURFING) return;

    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element) return;

    this.selectedElement = element;
    this.setStatus(STATUS.SELECTED);

    // 선택 효과 적용
    const overlay = document.getElementById('web_filter_overlay_element');
    if (overlay) {
      const theme = overlayStyles.themes[this.currentTheme];
      overlay.style.animation = 'none';
      overlay.style.transform = 'scale(1)';
      overlay.style.border = '2px solid ' + this.getThemeColor();
    }
  };

  private getThemeColor(): string {
    // 테마별 주요 색상 반환
    switch (this.currentTheme) {
      case 'pastel':
        return 'rgba(255, 182, 193, 0.5)';
      case 'neon':
        return '#00ff00';
      case 'minimal':
        return 'rgba(0, 0, 0, 0.2)';
      default:
        return 'rgba(62, 184, 255, 0.5)';
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.cleanupOverlay();
      this.setStatus(STATUS.INACTIVE);
      this.selectedElement = null;
    }
  };

  private bindEvents = () => {
    window.addEventListener('click', this.handleClick);
    window.addEventListener('keydown', this.handleKeyDown);
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

  public setTheme = (theme: keyof typeof overlayStyles.themes) => {
    this.currentTheme = theme;
    const overlay = document.getElementById('web_filter_overlay_element');

    if (overlay) {
      this.updateOverlayStyle(overlay);
    }
  };

  public cleanupOverlay = () => {
    // 스타일시트 제거
    if (this.styleSheet && document.head.contains(this.styleSheet)) {
      document.head.removeChild(this.styleSheet);
      this.styleSheet = null;
    }

    // 오버레이 제거
    if (this.overlay && document.body.contains(this.overlay)) {
      document.body.removeChild(this.overlay);
      this.overlay = null;
    }
  };

  public destroy = () => {
    this.cleanupOverlay();

    window.removeEventListener('click', this.handleClick);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
  };

  // TODO: mouseleave? 일 때 overlay 제거해주기
  // 다른 요소가 호버링되면, 감지되면 기존 Overlay 제거?
  // 선택한 정보 넘기기
}
