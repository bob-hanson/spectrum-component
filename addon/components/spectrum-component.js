import Ember from 'ember';
import layout from '../templates/components/spectrum-component';

const {
  Component,
  computed: { notEmpty },
  inject: { service }
} = Ember;

export default Component.extend({
  layout,
  visualizer: service(),
  uiUpdater: service(),

  spectrumTitle: "My Spectrum",
  currentTracks: null,
  initialTrack: null,
  hasInitialTrack: notEmpty('initialTrack'),
  currentTrack: null,

  init() {
    this._super(...arguments);
    this.get('visualizer').initAudioSetup();
  },

  didInsertElement() {
    this.get('visualizer').initVisualizer();
    this.get('uiUpdater').initUi();
    this.toggleControlPanel();
    this.checkForInitialTrack();
    window.addEventListener("keydown", this.keyControls.bind(this), false);
  },

  loadAndUpdate(trackUrl) {
    this.get('visualizer').loadStream(trackUrl, this);
  },

  checkForInitialTrack() {
    if (this.get('hasInitialTrack')) {
      this.loadAndUpdate(this.get('initialTrack').trackUrl);
    }
  },

  handlePlayerError() {
    this.get('uiUpdater').displayMessage("Error", "There was a problem loading the file");
  },

  updateControlPanelAndSpectrum(resolvedTrack) {
    this.set('currentTrack', resolvedTrack);
    this.get('uiUpdater').clearInfoPanel();
    this.get('uiUpdater').update(resolvedTrack);
    this.get('visualizer').processVisualization();
    setTimeout(this.toggleControlPanel.bind(this), 3000);
  },

  keyControls(e) {
    if (e.keyCode === 32) {
      this.get('visualizer').setPlayerState();
    }
  },

  toggleControlPanel() {
    this.get('uiUpdater').toggleControlPanel();
  },

  actions: {

    triggerLoadRequestedTrack(trackUrl) {
      this.loadAndUpdate(trackUrl);
    },

    triggerToggleControlPanel() {
      this.toggleControlPanel();
    }

  }

});
