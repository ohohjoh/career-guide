import { registerRoot, Composition } from 'remotion';
import { Flow } from './Flow';
const Root = () => (
  <Composition id="Flow" component={Flow} durationInFrames={330} fps={30} width={1280} height={720} />
);
registerRoot(Root);
