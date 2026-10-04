import { Component, type ReactNode } from 'react';
export default class RouteBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <section className="route-error" role="alert"><h2>Não foi possível abrir esta parte do estudo.</h2><p>Os registros já salvos continuam neste navegador. Se o salvamento estava bloqueado, exporte seu estudo antes de recarregar.</p><button onClick={() => this.setState({ failed: false })}>Tentar abrir novamente</button><button onClick={() => location.reload()}>Recarregar a página</button></section>;
    return this.props.children;
  }
}
